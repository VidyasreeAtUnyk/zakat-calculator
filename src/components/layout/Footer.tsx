export function Footer() {
  return (
    <footer className="no-print border-t border-mal-border bg-white py-6">
      <div className="mx-auto max-w-5xl px-4 text-center text-xs text-mal-gray sm:px-6">
        <p>
          Mal Zakat Calculator — for educational purposes. Consult a qualified
          scholar for your specific situation.
        </p>
        <p className="mt-1">© {new Date().getFullYear()} Mal</p>
      </div>
    </footer>
  );
}
