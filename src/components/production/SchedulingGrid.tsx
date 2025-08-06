import { TimeSlotRow } from "./TimeSlotRow";
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
      <div className="min-h-[600px]">
        {/* Equipment header */}
        <div className="sticky top-0 bg-background border-b border-border z-10">
          <div className={`grid min-h-[60px]`} style={{ gridTemplateColumns: `80px repeat(${equipment.length}, 1fr)` }}>
            <div className="border-r border-border p-4 bg-muted/30">
              <span className="font-semibold text-foreground">Time</span>
            </div>
            {equipment.map(eq => (
              <div key={eq.id} className="border-r border-border p-4 text-center bg-muted/30">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-medium text-foreground">
                    {eq.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {eq.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time slot rows */}
        <div className="divide-y divide-border">
          {timeSlots.map(slot => (
            <TimeSlotRow
              key={slot.hour}
              timeSlot={slot}
              equipment={equipment}
              jobs={jobs.filter(job => {
                if (!job.scheduledStart) return false;
                return job.scheduledStart.getHours() === slot.hour;
              })}
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