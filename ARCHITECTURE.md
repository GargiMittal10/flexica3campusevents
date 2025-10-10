# College Event Management System - Architecture & API Flow

## 🏗️ System Architecture Overview

This application follows a **modern full-stack architecture** using:

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  - React Components (UI)                                 │
│  - React Router (Navigation)                             │
│  - Supabase Client SDK (API Communication)               │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS REST API Calls
                   │ (via Supabase SDK)
┌──────────────────▼──────────────────────────────────────┐
│              LOVABLE CLOUD (Backend)                     │
│  - PostgreSQL Database                                   │
│  - Row Level Security (RLS)                              │
│  - Authentication (JWT)                                  │
│  - Edge Functions (Serverless)                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### 1. **User Registration (Signup)**
**File:** `src/pages/Signup.tsx`

```typescript
// User fills form and clicks "Create Account"
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      full_name: formData.name,
      student_id: formData.studentId,
      role: formData.role  // "student" or "faculty"
    }
  }
});
```

**What happens behind the scenes:**
1. ➡️ Frontend sends POST request to `/auth/v1/signup`
2. ⚙️ Lovable Cloud creates user in `auth.users` table
3. 🔄 Database trigger `on_auth_user_created` fires
4. 📝 Trigger calls `handle_new_user()` function
5. ✅ Creates profile in `profiles` table
6. 🎫 Returns JWT token to frontend
7. 🔀 Redirects to appropriate dashboard (student/faculty)

**Database Trigger:**
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

---

### 2. **User Login**
**File:** `src/pages/Login.tsx`

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

// Then fetch user profile to determine role
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", data.user.id)
  .single();

// Redirect based on role
if (profile?.role === "faculty") {
  navigate("/faculty-dashboard");
} else {
  navigate("/student-dashboard");
}
```

**API Flow:**
1. ➡️ POST `/auth/v1/token?grant_type=password`
2. 🔑 Backend validates credentials
3. 🎫 Returns access_token + refresh_token
4. 📊 Frontend queries `/rest/v1/profiles` to get role
5. 🔀 Redirects to correct dashboard

---

### 3. **Password Reset**
**New Feature - File:** `src/pages/Login.tsx` (dialog)

```typescript
// User clicks "Forgot Password"
const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
  redirectTo: `${window.location.origin}/reset-password`,
});
```

**Flow:**
1. ➡️ POST `/auth/v1/recover`
2. 📧 Sends reset email with magic link
3. 🔗 User clicks link → redirected to `/reset-password`
4. 🔑 User enters new password
5. ➡️ PUT `/auth/v1/user` with new password
6. ✅ Password updated, redirects to login

---

## 📊 Data Management (CRUD Operations)

### **Student Dashboard**

#### **QR Code Generation**
**File:** `src/components/student/QRCodeDisplay.tsx`

```typescript
// QR code data is automatically generated when profile is created
// via the generate_qr_data() trigger
<QRCodeSVG
  value={profile?.qr_code_data}  // Format: "STUDENT:uuid:student_id:timestamp"
  size={256}
/>
```

**Database Flow:**
- Profile creation triggers `generate_qr_data()`
- Function generates unique QR string
- Stored in `profiles.qr_code_data` column

---

#### **View Registered Events**
**File:** `src/components/student/RegisteredEvents.tsx`

```typescript
// GET registered events for student
const { data, error } = await supabase
  .from("event_registrations")
  .select(`
    id,
    registered_at,
    events (
      id,
      title,
      description,
      event_date,
      location
    )
  `)
  .eq("student_id", studentId)
  .order("registered_at", { ascending: false });
```

**REST API Translation:**
```
GET /rest/v1/event_registrations?select=id,registered_at,events(*)&student_id=eq.{uuid}
Authorization: Bearer {jwt_token}
```

**RLS Policy Applied:**
```sql
-- Students can view their own registrations
(student_id = auth.uid()) OR 
(EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'faculty'))
```

---

#### **Attendance Statistics**
**File:** `src/components/student/AttendanceStats.tsx`

```typescript
// Count total registrations
const { data: registrations } = await supabase
  .from("event_registrations")
  .select("id, event_id")
  .eq("student_id", studentId);

// Count attended events
const { data: attendance } = await supabase
  .from("attendance")
  .select("id")
  .eq("student_id", studentId);

// Calculate percentage
const percentage = (attendance.length / registrations.length) * 100;
```

**Multiple API Calls:**
1. `GET /rest/v1/event_registrations?student_id=eq.{uuid}&select=id,event_id`
2. `GET /rest/v1/attendance?student_id=eq.{uuid}&select=id`

---

### **Faculty Dashboard**

#### **Create Event**
**File:** `src/components/faculty/EventManagement.tsx`

```typescript
const { error } = await supabase.from("events").insert({
  title: formData.title,
  description: formData.description,
  event_date: formData.event_date,
  location: formData.location,
  created_by: facultyId  // Current user's ID
});
```

**REST API:**
```
POST /rest/v1/events
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "Tech Conference 2025",
  "description": "Annual tech event",
  "event_date": "2025-03-15T10:00:00Z",
  "location": "Main Auditorium",
  "created_by": "faculty-uuid"
}
```

**RLS Policy Check:**
```sql
-- Faculty can create events
EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND role = 'faculty'
)
```

---

#### **QR Scanner for Attendance**
**File:** `src/components/faculty/QRScanner.tsx`

```typescript
// When QR code is scanned
const onScanSuccess = async (decodedText: string) => {
  // Parse QR: "STUDENT:uuid:12345:timestamp"
  const parts = decodedText.split(":");
  const studentId = parts[1];
  
  // Mark attendance
  const { error } = await supabase.from("attendance").insert({
    event_id: selectedEvent,
    student_id: studentId,
    marked_by: facultyUserId,
    qr_data: decodedText
  });
};
```

**API Flow:**
1. 📱 Faculty opens QR scanner
2. 📸 Camera scans student's QR code
3. 🔍 Extracts student_id from QR data
4. ➡️ POST `/rest/v1/attendance`
```json
{
  "event_id": "event-uuid",
  "student_id": "student-uuid",
  "marked_by": "faculty-uuid",
  "qr_data": "STUDENT:..."
}
```
5. ✅ RLS verifies faculty role before insert

---

#### **Analytics Dashboard**
**File:** `src/components/faculty/AnalyticsDashboard.tsx`

```typescript
// Get registration count
const { count: regCount } = await supabase
  .from("event_registrations")
  .select("*", { count: "exact", head: true })
  .eq("event_id", selectedEvent);

// Get attendance count  
const { count: attCount } = await supabase
  .from("attendance")
  .select("*", { count: "exact", head: true })
  .eq("event_id", selectedEvent);

// Calculate rate
const rate = (attCount / regCount) * 100;
```

**REST API:**
```
GET /rest/v1/event_registrations?event_id=eq.{uuid}&select=count
HEAD /rest/v1/attendance?event_id=eq.{uuid}
```

---

## 🛡️ Row Level Security (RLS)

### How RLS Works
Every database query automatically includes the user's JWT token. The backend extracts `auth.uid()` from the token and applies RLS policies.

**Example: Attendance Table**

```sql
-- Students can only see their own attendance
CREATE POLICY "Students can view their own attendance"
ON attendance FOR SELECT
USING (student_id = auth.uid());

-- Faculty can see all attendance
CREATE POLICY "Faculty can view all attendance"
ON attendance FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'faculty'
  )
);
```

When a student queries:
```typescript
const { data } = await supabase
  .from("attendance")
  .select("*");
```

The actual SQL executed:
```sql
SELECT * FROM attendance 
WHERE student_id = '{current_user_uuid}';  -- Auto-filtered by RLS
```

---

## 🔄 Real-time Updates (Optional Enhancement)

You can add real-time subscriptions:

```typescript
// Listen for new events
const channel = supabase
  .channel('events-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'events'
    },
    (payload) => {
      console.log('New event created!', payload);
      // Update UI automatically
    }
  )
  .subscribe();
```

---

## 📧 Email Notifications

**File:** `supabase/functions/send-notification/index.ts`

```typescript
// When event is created, send email via edge function
const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${RESEND_API_KEY}`,
  },
  body: JSON.stringify({
    from: "CampusEvents <noreply@campusevents.com>",
    to: [studentEmail],
    subject: "New Event Created",
    html: emailTemplate
  }),
});
```

**Trigger:**
Can be called from frontend or via database trigger when events are created.

---

## 🎯 Complete Request Flow Example

**Scenario: Student views their dashboard**

1. **Page Load**
```typescript
// src/pages/StudentDashboard.tsx
useEffect(() => {
  checkUser();
}, []);
```

2. **Authentication Check**
```typescript
const { data: { user } } = await supabase.auth.getUser();
// ➡️ GET /auth/v1/user (includes JWT in headers)
```

3. **Fetch Profile**
```typescript
const { data: profileData } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();
// ➡️ GET /rest/v1/profiles?id=eq.{uuid}&select=*
```

4. **Load QR Code** (from profile data)
```typescript
<QRCodeSVG value={profile.qr_code_data} />
// No API call - data already loaded
```

5. **Load Events**
```typescript
const { data } = await supabase
  .from("event_registrations")
  .select("id, events(*)")
  .eq("student_id", user.id);
// ➡️ GET /rest/v1/event_registrations?student_id=eq.{uuid}&select=id,events(*)
```

6. **Load Statistics**
```typescript
// Two parallel API calls
await Promise.all([
  supabase.from("event_registrations").select("id").eq("student_id", id),
  supabase.from("attendance").select("id").eq("student_id", id)
]);
```

---

## 🔑 Key Takeaways

1. **Supabase SDK = REST API Wrapper**
   - All `supabase.from()` calls → REST API requests
   - Authentication handled via JWT tokens
   - RLS policies filter data automatically

2. **Security First**
   - JWT tokens verify user identity
   - RLS policies enforce data access rules
   - Role-based access (student vs faculty)

3. **Efficient Data Fetching**
   - Use `.select()` to get related data in one call
   - Leverage RLS instead of client-side filtering
   - Batch queries when possible

4. **State Management**
   - React state for UI
   - Supabase for data persistence
   - No additional state management needed (Redux/MobX)

This architecture provides a scalable, secure foundation for your college event management system! 🚀
