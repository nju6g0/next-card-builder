import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌資訊 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">💌</span>
              <span className="text-xl font-bold text-white">Card Builder</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              可拖拉元件自訂邀請函的網站平台
            </p>
            <p className="text-xs text-gray-500">
              使用 Next.js、TypeScript、Tailwind CSS 建構
            </p>
          </div>

          {/* 快速連結 */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速連結</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  首頁
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-white transition">
                  範本
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  我的邀請函
                </Link>
              </li>
            </ul>
          </div>

          {/* 關於 */}
          <div>
            <h3 className="text-white font-semibold mb-4">關於專案</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  GitHub
                </a>
              </li>
              <li>
                <span className="text-gray-500">Demo 專案</span>
              </li>
              <li>
                <span className="text-gray-500">純前端實作</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 版權資訊 */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {currentYear} Card Builder. Demo Project for Learning Purposes.</p>
        </div>
      </div>
    </footer>
  );
}
