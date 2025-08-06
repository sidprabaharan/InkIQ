import { TimeSlotRow } from "./TimeSlotRow";
import { PrintavoJob, DecorationMethod, ProductionStage } from "./PrintavoPowerScheduler";

interface SchedulingGridProps {
  jobs: PrintavoJob[];
  selectedDate: Date;
  selectedMethod: DecorationMethod;
  selectedStage: ProductionStage;
  onJobSchedule: (jobId: string, equipmentId: string, startTime: Date, endTime: Date) => void;
  onJobUnschedule: (jobId: string) => void;
  onStageAdvance: (jobId: string) => void;
  onJobClick?: (job: PrintavoJob) => void;
}

// Equipment configurations for different decoration methods and stages
const equipmentConfig = {
  screen_printing: {
    burn_screens: [
      { id: "screen-room-1", name: "Screen Room A", capacity: 20, type: "Screen Station" },
      { id: "screen-room-2", name: "Screen Room B", capacity: 20, type: "Screen Station" }
    ],
    mix_ink: [
      { id: "ink-station-1", name: "Ink Station 1", capacity: 10, type: "Ink Mixing" },
      { id: "ink-station-2", name: "Ink Station 2", capacity: 10, type: "Ink Mixing" }
    ],
    print: [
      { id: "press-1", name: "M&R Sportsman E", capacity: 840, type: "Automatic Press" },
      { id: "press-2", name: "M&R Gauntlet III", capacity: 720, type: "Automatic Press" },
      { id: "press-3", name: "Manual Press #1", capacity: 300, type: "Manual Press" }
    ]
  },
  embroidery: {
    digitize: [
      { id: "digitize-1", name: "Digitizing Station 1", capacity: 5, type: "Digitizing" },
      { id: "digitize-2", name: "Digitizing Station 2", capacity: 5, type: "Digitizing" }
    ],
    hoop: [
      { id: "hoop-station-1", name: "Hooping Station", capacity: 50, type: "Hooping" }
    ],
    embroider: [
      { id: "emb-1", name: "Brother PR-1050X", capacity: 200, type: "10-Head Machine" },
      { id: "emb-2", name: "Tajima TMAR-1501", capacity: 180, type: "15-Head Machine" }
    ]
  },
  dtf: {
    design_file: [
      { id: "design-station-1", name: "Design Station", capacity: 10, type: "Design Work" }
    ],
    dtf_print: [
      { id: "dtf-printer-1", name: "Epson F570", capacity: 400, type: "DTF Printer" }
    ],
    powder: [
      { id: "powder-station-1", name: "Powder Station", capacity: 200, type: "Powder Application" }
    ],
    cure: [
      { id: "cure-oven-1", name: "Cure Oven", capacity: 100, type: "Curing Oven" }
    ]
  },
  dtg: {
    pretreat: [
      { id: "pretreat-1", name: "Pretreat Station", capacity: 500, type: "Pretreatment" }
    ],
    dtg_print: [
      { id: "dtg-1", name: "Brother GTX", capacity: 300, type: "DTG Printer" },
      { id: "dtg-2", name: "Epson F2100", capacity: 250, type: "DTG Printer" }
    ],
    dtg_cure: [
      { id: "dtg-cure-1", name: "DTG Cure Tunnel", capacity: 200, type: "Curing" }
    ]
  }
};

export function SchedulingGrid({ 
  jobs, 
  selectedDate, 
  selectedMethod, 
  selectedStage,
  onJobSchedule, 
  onJobUnschedule,
  onStageAdvance,
  onJobClick
}: SchedulingGridProps) {
  const equipment = equipmentConfig[selectedMethod]?.[selectedStage] || [];
  
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
              onStageAdvance={onStageAdvance}
              onJobClick={onJobClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}