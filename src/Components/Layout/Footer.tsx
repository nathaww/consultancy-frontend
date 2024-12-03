const Footer = () => {
  return (
    <footer className="px-4 py-8 bg-gray-100 w-full">
      <div className="flex flex-col sm:flex-row lg:flex-row justify-center gap-x-2 text-xs sm:text-sm lg:text-sm">
        <div className="flex items-center justify-center flex-shrink-0 h-12 rounded-full dark:bg-violet-400">
          Copyright ©2024 consultancy
        </div>
        <ul className="flex flex-wrap justify-center items-center gap-2">
          <li>
            <a rel="noopener noreferrer" href="#">
              Terms of Use
            </a>
          </li>
          <li>
            <a rel="noopener noreferrer" href="#">
              Privacy
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
