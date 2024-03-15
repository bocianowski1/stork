// import { FaStar } from "react-icons/fa";
import { MdLoop } from "react-icons/md";
import { IoIosArrowRoundDown } from "react-icons/io";
import { IoChatbubbleOutline, IoMailOutline } from "react-icons/io5";
import { CiBellOn } from "react-icons/ci";
import { PiTimer } from "react-icons/pi";
import { FiUser } from "react-icons/fi";

export function IconImage({ name }: { name: string }) {
  switch (name) {
    // auth providers
    case "email":
      return <IoMailOutline size={22} />;
    case "google":
      return (
        <img src={`./google.png`} alt="" className="size-5 object-cover" />
      );
    case "facebook":
      return (
        <img src={`./facebook.png`} alt="" className="size-5 object-cover" />
      );

    // realtime events
    case "chat":
      return <IoChatbubbleOutline size={22} />;
    case "notifications":
      return <CiBellOn size={22} />;
    case "live_updates":
      return <PiTimer size={22} />;

    // payment types
    case "one_time":
      return <IoIosArrowRoundDown size={22} />;
    case "subscriptions":
      return <MdLoop size={22} />;

    // automations
    case "welcome_email":
      return <IoMailOutline size={22} />;
    case "activity_updates":
      return <FiUser size={22} />;
    case "scheduled_tasks":
      return <PiTimer size={22} />;
  }
}
