import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

export default function SidebarBox() {
  return (
    <div className="text-xl flex flex-col p-3 m-2 pt-6 ml-auto max-w-xl justify-start items-center text-macchiato-text">
      <a
        href="https://github.com/x1nx3r"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub className="hover:text-macchiato-overlay0 p-2 w-auto h-auto text-3xl" />
      </a>
      <a
        href="https://www.instagram.com/x1nx3r/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram className="hover:text-macchiato-overlay0 p-2 w-auto h-auto text-3xl" />
      </a>
    </div>
  );
}
