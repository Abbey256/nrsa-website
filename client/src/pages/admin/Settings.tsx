import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettings() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
        <p className="text-muted-foreground mt-2">Manage website configuration</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Site Title</Label>
              <Input defaultValue="Nigeria Rope Skipping Association" data-testid="input-site-title" />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input defaultValue="+2347069465965" data-testid="input-phone" />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input defaultValue="info@nrsa.ng" data-testid="input-email" />
            </div>
            <div>
              <Label>About Text (Homepage)</Label>
              <Textarea className="min-h-[120px]" data-testid="input-about" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Facebook URL</Label>
              <Input placeholder="https://facebook.com/nrsa" data-testid="input-facebook" />
            </div>
            <div>
              <Label>Twitter URL</Label>
              <Input placeholder="https://twitter.com/nrsa" data-testid="input-twitter" />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input placeholder="https://instagram.com/nrsa" data-testid="input-instagram" />
            </div>
          </CardContent>
        </Card>

        <Button className="bg-primary hover:bg-primary/90" data-testid="button-save-settings">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
