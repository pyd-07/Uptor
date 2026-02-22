import Image from "next/image";
import AddMonitorForm from "@/components/layout/monitors/AddMonitorForm";

export default function AddMonitorsPage() {
  return (
    <div className="overflow-y-auto no-scrollbar">
      <header className="flex justify-between items-start w-full mt-0">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Add Monitors</h3>
          <blockquote className="mt-6 border-l-2 pl-6 italic">
            Configure your endpoint checks with reliable defaults.
          </blockquote>
        </div>

        <Image src="/streetlights.png" alt="Streetlights" width={48} height={12} />
      </header>

      <div className="pt-6">
        <AddMonitorForm />
      </div>
      
    </div>
  );
}