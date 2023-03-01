const Footer = () => {
  return (
    <footer>
      <div className="text-center text-sm text-dark">
        <div className="container mx-auto px-4">
          <div className="flex pb-5 justify-center">
            <div className="p-2">
              <span className="font-bold text-lg mr-2 dark:text-gray-200"> Programmers Life</span>
              <span className="dark:text-gray-400">
                &copy; {new Date().getFullYear()}   All Rights Reserved
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
