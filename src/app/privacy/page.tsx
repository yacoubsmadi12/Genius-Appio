import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline">Privacy Policy</CardTitle>
          <p className="text-muted-foreground pt-2">Last updated: September 23, 2025</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full pr-4">
            <div className="space-y-6 text-muted-foreground">
              <p>
                Welcome to Genius APPio. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">1. Information We Collect</h3>
                <p>
                  We may collect personal information such as your name, email address, and payment information when you register for an account, use our services, or communicate with us. We also collect non-personal information, such as browser type, operating system, and website usage data. For app generation, we process the prompts you provide but do not store them long-term in association with your personal account after the generation is complete.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h3>
                <p>
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Provide, operate, and maintain our services.</li>
                  <li>Improve, personalize, and expand our services.</li>
                  <li>Understand and analyze how you use our services.</li>
                  <li>Process your transactions and manage your subscriptions.</li>
                  <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
                  <li>Send you emails.</li>
                  <li>Find and prevent fraud.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">3. Sharing Your Information</h3>
                <p>
                  We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">4. Security of Your Information</h3>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">5. Changes to This Privacy Policy</h3>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
