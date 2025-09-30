import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-in fade-in duration-500">
      <h1 className="text-5xl font-extrabold mb-4 text-primary">
        <span className="text-red-600">Data</span> Combat
      </h1>
      <p className="text-xl text-foreground mb-8 max-w-2xl">
        Unleash your inner data samurai. Battle insights, conquer challenges, and master your data domain.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
          <h2 className="text-2xl font-semibold mb-2 text-primary">Strategic Planning</h2>
          <p className="text-muted-foreground">Plan your data attacks with precision and foresight.</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
          <h2 className="text-2xl font-semibold mb-2 text-primary">Real-time Insights</h2>
          <p className="text-muted-foreground">Gain immediate intelligence on your data battlefield.</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
          <h2 className="text-2xl font-semibold mb-2 text-primary">Secure Data Fortress</h2>
          <p className="text-muted-foreground">Protect your valuable data with impenetrable defenses.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;