import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { approvalId } = await req.json();

    console.log("Processing approval for:", approvalId);

    // Get the approval details
    const { data: approval, error: approvalError } = await supabaseAdmin
      .from("pending_faculty_approvals")
      .select("*")
      .eq("id", approvalId)
      .eq("status", "pending")
      .single();

    if (approvalError || !approval) {
      throw new Error("Approval request not found or already processed");
    }

    console.log("Found approval for:", approval.email);

    // Generate a random password (user will need to reset)
    const tempPassword = crypto.randomUUID();

    // Create the auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: approval.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: approval.full_name,
        student_id: approval.student_id,
        role: "faculty",
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      throw authError;
    }

    console.log("Created auth user:", authData.user.id);

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        full_name: approval.full_name,
        email: approval.email,
        student_id: approval.student_id,
        role: "faculty",
      });

    if (profileError) {
      console.error("Profile error:", profileError);
      // Cleanup: delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    console.log("Created profile");

    // Assign faculty role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: authData.user.id,
        role: "faculty",
      });

    if (roleError) {
      console.error("Role error:", roleError);
      throw roleError;
    }

    console.log("Assigned faculty role");

    // Get admin user ID from authorization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user: adminUser } } = await supabaseAdmin.auth.getUser(token || "");

    // Update approval status
    const { error: updateError } = await supabaseAdmin
      .from("pending_faculty_approvals")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminUser?.id,
      })
      .eq("id", approvalId);

    if (updateError) {
      console.error("Update error:", updateError);
      throw updateError;
    }

    console.log("Updated approval status");

    // Send password reset email
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: approval.email,
    });

    if (resetError) {
      console.error("Reset email error:", resetError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Faculty approved and account created successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
