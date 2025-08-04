import { DecoratorNetwork } from '@/components/marketplace/DecoratorNetwork';

export default function DecoratorNetworkPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Decorator Network</h1>
        <p className="text-muted-foreground">
          Connect with verified decorators to outsource your printing and embroidery needs
        </p>
      </div>
      <DecoratorNetwork />
    </div>
  );
}