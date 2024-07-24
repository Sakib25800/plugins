import {
  CalendarIcon,
  ChartIcon,
  FormsIcon,
  PersonIcon,
  LightningIcon,
  MessageIcon,
} from "@/components/Icons";
import { useLocation } from "wouter";
import { Logo } from "../components/Logo";

const MenuOption = ({
  icon,
  title,
  to,
  onClick,
}: {
  icon: React.ReactElement;
  title: string;
  to: string;
  onClick?: () => void;
}) => {
  const [, setLocation] = useLocation();

  return (
    <div
      className="h-[110px] w-[110px] tile col items-center justify-center rounded-md cursor-pointer"
      onClick={() => {
        setLocation(to);
        onClick && onClick();
      }}
    >
      {icon}
      <p className="font-semibold">{title}</p>
    </div>
  );
};

export function MenuPage() {
  return (
    <div className="col-lg">
      <div className="col items-center py-15 px-15">
        <Logo />
        <h6>Welcome to HubSpot</h6>
        <p className="text-center max-w-50 text-tertiary">
          View your forms, monitor your site traffic, embed widgets and more.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <MenuOption title="Forms" to="/forms" icon={<FormsIcon />} />
        <MenuOption title="Tracking" to="/tracking" icon={<ChartIcon />} />
        <MenuOption title="Widgets" to="/widgets" icon={<CalendarIcon />} />
        <MenuOption title="Events(WIP)" to="/events" icon={<LightningIcon />} />
        <MenuOption title="Chatflows" to="/chat" icon={<MessageIcon />} />
        <MenuOption title="Account" to="/account" icon={<PersonIcon />} />
      </div>
    </div>
  );
}
