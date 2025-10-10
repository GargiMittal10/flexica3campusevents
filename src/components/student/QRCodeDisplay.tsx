import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRCodeDisplayProps {
  profile: any;
}

const QRCodeDisplay = ({ profile }: QRCodeDisplayProps) => {
  const downloadQR = () => {
    const svg = document.getElementById("student-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${profile.student_id}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your QR Code</CardTitle>
        <CardDescription>
          Show this QR code to faculty members to mark your attendance at events
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <QRCodeSVG
            id="student-qr-code"
            value={profile?.qr_code_data || ""}
            size={256}
            level="H"
            includeMargin
          />
        </div>
        <div className="text-center space-y-2">
          <p className="font-semibold text-lg">{profile?.full_name}</p>
          <p className="text-muted-foreground">Student ID: {profile?.student_id}</p>
        </div>
        <Button onClick={downloadQR} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
