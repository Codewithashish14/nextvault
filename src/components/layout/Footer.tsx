// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Secure Vault. All rights reserved.
        </p>
      </div>
    </footer>
  );
}