// src/app/login/layout.tsx
import React from "react";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
  <div className="min-h-screen bg-gray-50">
  {children}
</div>

  );
};

export default LoginLayout;
