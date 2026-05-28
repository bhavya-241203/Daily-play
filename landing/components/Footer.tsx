const links = {
  Product: [
    { label: 'App', href: '#' },
    { label: 'WhatsApp Bot', href: '#whatsapp' },
    { label: 'Tournaments', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Cities: [
    { label: 'Bangalore', href: '#cities' },
    { label: 'Mumbai', href: '#cities' },
    { label: 'Pune', href: '#cities' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0a0e1a] border-t border-[#1e2540]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏆</span>
              <span className="text-xl font-bold">
                <span className="text-gradient">Daily</span>
                <span className="text-[#f1f5f9]"> Play</span>
              </span>
            </div>
            <p className="text-[#64748b] text-sm leading-relaxed">
              Find your game. Show up. Repeat.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4 mt-5">
              <a
                href="#"
                className="text-[#64748b] hover:text-[#f1f5f9] transition-colors text-sm font-medium"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-[#64748b] hover:text-[#f1f5f9] transition-colors text-sm font-medium"
                aria-label="Twitter / X"
              >
                Twitter/X
              </a>
              <a
                href="#"
                className="text-[#64748b] hover:text-[#25d366] transition-colors text-sm font-medium"
                aria-label="WhatsApp"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-[#f1f5f9] font-semibold text-sm mb-4 uppercase tracking-wide">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-[#64748b] hover:text-[#f1f5f9] transition-colors text-sm"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#1e2540] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#64748b] text-sm text-center md:text-left">
              © 2026 Daily Play. Made with ❤️ for India&apos;s sporting culture.
            </p>
            <div className="flex gap-4 text-[#64748b] text-xs">
              <a href="#" className="hover:text-[#f1f5f9] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#f1f5f9] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
