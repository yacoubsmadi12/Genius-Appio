import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline">Return &amp; Refund Policy</CardTitle>
          <p className="text-muted-foreground pt-2">Last updated: September 23, 2025</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full pr-4">
            <div className="space-y-6 text-muted-foreground">
              <p>
                Thank you for subscribing to Genius APPio. We appreciate your business. Please read this policy carefully. This is the Return and Refund Policy of Genius APPio.
              </p>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Digital Products</h3>
                <p>
                  We issue refunds for our digital subscription products within 7 days of the original purchase of the product.
                </p>
                <p>
                  We recommend contacting us for assistance if you experience any issues receiving or using our products.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Subscription Services</h3>
                <p>
                  For our monthly and annual subscription services, you may cancel your subscription at any time. When you cancel, you will continue to have access to the service until the end of your current billing period. We do not offer prorated refunds for subscriptions that are canceled mid-period.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">How to Request a Refund</h3>
                <p>
                  To request a refund, please contact our support team via the contact form on our website or by emailing support@appforge.ai. Please include your order number and the reason for your refund request.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Contact us</h3>
                <p>
                  If you have any questions about our Returns and Refunds Policy, please contact us:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>By email: support@appforge.ai</li>
                  <li>By visiting the contact page on our website</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
