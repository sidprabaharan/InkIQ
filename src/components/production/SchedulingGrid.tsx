import { EquipmentLane } from "./EquipmentLane";
import { PrintavoJob, DecorationMethod } from "./PrintavoPowerScheduler";

interface SchedulingGridProps {
  jobs: PrintavoJob[];
  selectedDate: Date;
  selectedMethod: DecorationMethod;
  onJobSchedule: (jobId: string, equipmentId: string, startTime: Date, endTime: Date) => void;
  onJobUnschedule: (jobId: string) => void;
}

// Equipment configurations for different decoration methods
const equipmentConfig = {
  screen_printing: [
    { id: "press-1", name: "M&R Sportsman E", capacity: 840, type: "Automatic Press" },
    { id: "press-2", name: "M&R Gauntlet III", capacity: 720, type: "Automatic Press" },
    { id: "press-3", name: "Manual Press #1", capacity: 300, type: "Manual Press" },
    { id: "press-4", name: "Manual Press #2", capacity: 300, type: "Manual Press" }
  ],
  embroidery: [
    { id: "emb-1", name: "Brother PR-1050X", capacity: 200, type: "10-Head Machine" },
    { id: "emb-2", name: "Tajima TMAR-1501", capacity: 180, type: "15-Head Machine" },
    { id: "emb-3", name: "Barudan BEVS-1204", capacity: 160, type: "12-Head Machine" }
  ],
  dtf: [
    { id: "dtf-1", name: "Epson F570", capacity: 400, type: "DTF Printer" },
    { id: "dtf-2", name: "Heat Press Station 1", capacity: 200, type: "Heat Press" },
    { id: "dtf-3", name: "Heat Press Station 2", capacity: 200, type: "Heat Press" }
  ],
  dtg: [
    { id: "dtg-1", name: "Brother GTX", capacity: 300, type: "DTG Printer" },
    { id: "dtg-2", name: "Epson F2100", capacity: 250, type: "DTG Printer" },
    { id: "dtg-3", name: "Pretreat Station", capacity: 500, type: "Pretreatment" }
  ]
};

export function SchedulingGrid({ 
  jobs, 
  selectedDate, 
  selectedMethod, 
  onJobSchedule, 
  onJobUnschedule 
}: SchedulingGridProps) {
  const equipment = equipmentConfig[selectedMethod];
  
  // Time slots for the day (8 AM to 6 PM)
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 8;
    return {
      hour,
      label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
    };
  });

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="min-w-[1000px]">
        {/* Time header */}
        <div className="sticky top-0 bg-background border-b border-border z-10">
          <div className="grid grid-cols-[200px_1fr] min-h-[60px]">
            <div className="border-r border-border p-4 bg-muted/30">
              <span className="font-semibold text-foreground">Equipment</span>
            </div>
            <div className="grid grid-cols-10">
              {timeSlots.map(slot => (
                <div key={slot.hour} className="border-r border-border p-4 text-center bg-muted/30">
                  <span className="text-sm font-medium text-foreground">
                    {slot.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipment lanes */}
        <div className="divide-y divide-border">
          {equipment.map(eq => (
            <EquipmentLane
              key={eq.id}
              equipment={eq}
              jobs={jobs.filter(job => job.equipmentId === eq.id)}
              timeSlots={timeSlots}
              selectedDate={selectedDate}
              onJobSchedule={onJobSchedule}
              onJobUnschedule={onJobUnschedule}
            />
          ))}
        </div>
      </div>
    </div>
  );
}