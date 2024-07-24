import Calendar from "../assets/Calendar.png";
import { ComponentInsert } from "../components/ComponentInsert";

export function WidgetsPage() {
  return (
    <div className="col-lg">
      <div className="grid grid-cols-2 gap-2.5">
        <ComponentInsert
          url="https://framer.com/m/HubSpot-Plugin-nyBq.js"
          image={Calendar}
        >
          <div className="flex flex-col items-center justify-center w-[110px] h-[110px] p-15 rounded-md tile cursor-pointer">
            <img
              src={Calendar}
              draggable={false}
              alt="HubSpot meeting widget"
            />
            <p className="text-[11px] text-tertiary">Schedule</p>
          </div>
        </ComponentInsert>
      </div>
    </div>
  );
}
