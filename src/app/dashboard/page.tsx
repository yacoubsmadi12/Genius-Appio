import { GenerationForm } from "./components/generation-form";
import { ProgressSidebar } from "./components/progress-sidebar";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Dashboard
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Let's forge your new application.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <GenerationForm />
        </div>
        <div className="lg:col-span-1">
          <ProgressSidebar />
        </div>
      </div>
    </div>
  );
}
