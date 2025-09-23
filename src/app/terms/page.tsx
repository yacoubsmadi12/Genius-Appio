import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline">Terms &amp; Conditions</CardTitle>
          <p className="text-muted-foreground pt-2">Last updated: September 23, 2025</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full pr-4">
            <div className="space-y-6 text-muted-foreground">
              <p>
                Please read these terms and conditions carefully before using Our Service.
              </p>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">1. Agreement to Terms</h3>
                <p>
                  By using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you do not have permission to access the service.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">2. Subscriptions</h3>
                <p>
                  Some parts of the service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (such as monthly or annually), depending on the type of subscription plan you select when purchasing the subscription.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">3. Content</h3>
                <p>
                  Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post on or through the service, including its legality, reliability, and appropriateness. The output of our generative AI services is provided to you for your use, but we make no claims about the ownership, copyright, or fitness for a particular purpose of the generated code or assets.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">4. Prohibited Uses</h3>
                <p>
                  You may use the service only for lawful purposes and in accordance with the Terms. You agree not to use the service in any way that violates any applicable national or international law or regulation.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">5. Termination</h3>
                <p>
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h3>
                <p>
                  In no event shall Genius APPio, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                </p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
