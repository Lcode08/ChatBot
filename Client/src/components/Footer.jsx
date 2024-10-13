import React from "react";

function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-gray-300 p-2 flex flex-col text-center fixed bottom-0 left-0 lg:block">
      {/* Developer Name */}
      <p className="text-lg font-semibold">Lokesh Patil</p>

      {/* Current Year and Copyright Notice */}
      <p>&copy; {new Date().getFullYear()} | All rights reserved</p>

      {/* Email Link for Contact */}
      <a
        href="mailto:lokeshbpatil2004@gmail.com"
        className="mt-1 text-blue-400 hover:text-blue-500 transition-all duration-300"
      >
        Get in touch: lokeshbpatil2004@gmail.com
      </a>
    </footer>
  );
}

export default Footer;
