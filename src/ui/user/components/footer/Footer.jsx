import React from 'react';

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between bg-black text-white px-6 md:px-[60px] py-6 md:h-[100px] text-center md:text-left space-y-4 md:space-y-0">
      
      <div className="text-3xl">
        <h1 className="no-underline">IMS</h1>
      </div>

      <div className="text-sm">
        <p>Privacy Notice</p>
        <p>© 2025 Verisk Nepal Pvt. Ltd. All rights reserved.</p>
      </div>

      <div>
        <h5 className="text-sm">VERISK ANALYTICS ®</h5>
      </div>
      
    </footer>
  );
};

export default Footer;
