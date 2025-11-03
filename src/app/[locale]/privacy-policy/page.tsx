export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {locale === "vi" ? <VietnameseContent /> : <EnglishContent />}
    </div>
  );
}

function EnglishContent() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

      <div className="space-y-6 text-gray-700">
        <section>
          <p className="text-sm text-gray-500 mb-6">
            Last updated: October 1, 2025
          </p>

          <p className="mb-4">
            Welcome to the Wildlife Protection Legal Lookup system. We are
            committed to protecting your privacy and ensuring transparency about
            how we handle your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Information We Collect
          </h2>
          <p className="mb-3">
            Our website is designed to be privacy-friendly. We collect minimal
            information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Analytics Data:</strong> We use Google Analytics to
              understand how visitors interact with our website. This includes
              anonymous data such as page views, session duration, and general
              location (country/city level).
            </li>

            <li>
              <strong>No Personal Data:</strong> We do not collect, store, or
              process any personally identifiable information such as names,
              email addresses, or phone numbers.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. How We Use Information
          </h2>
          <p className="mb-3">The information we collect is used solely for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Improving website functionality and user experience</li>
            <li>Understanding usage patterns to enhance our content</li>
            <li>Ensuring the security and integrity of our service</li>
            <li>Generating anonymous statistics about website usage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Cookies and Tracking
          </h2>
          <p className="mb-3">
            We use cookies to enhance your browsing experience:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Language Preference:</strong> We store your language
              preference (English or Vietnamese) to provide a consistent
              experience across visits.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Data Sharing and Third Parties
          </h2>
          <p className="mb-3">
            We do not sell, trade, or transfer your information to third
            parties.{" "}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Data Security
          </h2>
          <p className="mb-3">
            We implement appropriate security measures to protect against
            unauthorized access or alteration of data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Children&apos;s Privacy
          </h2>
          <p className="mb-3">
            Our website is intended for general audiences and does not knowingly
            collect information from children under 13 years of age.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Your Rights
          </h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Disable cookies in your browser settings</li>
            <li>Access and control your browser&apos;s local storage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Legal Basis for Processing
          </h2>
          <p className="mb-3">
            We process information based on legitimate interests in operating
            and improving our website, and to comply with legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Changes to This Policy
          </h2>
          <p className="mb-3">
            We may update this privacy policy from time to time. The &quot;Last
            updated&quot; date at the top of this page indicates when the policy
            was last revised.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            10. Contact Information
          </h2>
          <p className="mb-3">
            If you have questions or concerns about this privacy policy, please
            contact us through our GitHub repository at{" "}
            <a
              href="mailto:lehoangphuc1820@gmail.com"
              className="text-blue-600 hover:underline"
            >
              lehoangphuc1820@gmail.com
            </a>
          </p>
        </section>

        <section className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            This privacy policy is effective as of October 1, 2025, and applies
            to all users of the Wildlife Protection Legal Lookup website.
          </p>
        </section>
      </div>
    </>
  );
}

function VietnameseContent() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Chính Sách Bảo Mật
      </h1>

      <div className="space-y-6 text-gray-700">
        <section>
          <p className="text-sm text-gray-500 mb-6">
            Cập nhật lần cuối: 1 tháng 10, 2025
          </p>

          <p className="mb-4">
            Chào mừng bạn đến với hệ thống tra cứu pháp luật bảo vệ động vật
            hoang dã. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và đảm bảo
            minh bạch về cách chúng tôi xử lý thông tin của bạn.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Thông Tin Chúng Tôi Thu Thập
          </h2>
          <p className="mb-3">
            Website của chúng tôi được thiết kế thân thiện với quyền riêng tư.
            Chúng tôi chỉ thu thập thông tin tối thiểu:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Dữ Liệu Phân Tích:</strong> Chúng tôi sử dụng Google
              Analytics để hiểu cách người dùng tương tác với website. Điều này
              bao gồm dữ liệu ẩn danh như lượt xem trang, thời lượng phiên và vị
              trí chung (cấp quốc gia/thành phố).
            </li>

            <li>
              <strong>Không Thu Thập Dữ Liệu Cá Nhân:</strong> Chúng tôi không
              thu thập, lưu trữ hoặc xử lý bất kỳ thông tin nhận dạng cá nhân
              nào như tên, địa chỉ email hoặc số điện thoại.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Cách Chúng Tôi Sử Dụng Thông Tin
          </h2>
          <p className="mb-3">
            Thông tin chúng tôi thu thập chỉ được sử dụng để:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cải thiện chức năng và trải nghiệm người dùng của website</li>
            <li>Hiểu các mẫu sử dụng để nâng cao nội dung</li>
            <li>Đảm bảo tính bảo mật và toàn vẹn của dịch vụ</li>
            <li>Tạo thống kê ẩn danh về việc sử dụng website</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Cookies và Theo Dõi
          </h2>
          <p className="mb-3">
            Chúng tôi sử dụng cookies để nâng cao trải nghiệm duyệt web của bạn:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Tùy Chọn Ngôn Ngữ:</strong> Chúng tôi lưu trữ tùy chọn
              ngôn ngữ của bạn (Tiếng Anh hoặc Tiếng Việt) để cung cấp trải
              nghiệm nhất quán qua các lần truy cập.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Chia Sẻ Dữ Liệu và Bên Thứ Ba
          </h2>
          <p className="mb-3">
            Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin của bạn cho
            bên thứ ba.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Bảo Mật Dữ Liệu
          </h2>
          <p className="mb-3">
            Chúng tôi triển khai các biện pháp bảo mật phù hợp để bảo vệ chống
            lại việc truy cập hoặc thay đổi dữ liệu trái phép.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Quyền Riêng Tư Của Trẻ Em
          </h2>
          <p className="mb-3">
            Website của chúng tôi dành cho đối tượng công chúng chung và không
            cố ý thu thập thông tin từ trẻ em dưới 13 tuổi.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Quyền Của Bạn
          </h2>
          <p className="mb-3">Bạn có quyền:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Tắt cookies trong cài đặt trình duyệt của bạn</li>
            <li>Truy cập và kiểm soát bộ nhớ cục bộ của trình duyệt</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Cơ Sở Pháp Lý Cho Xử Lý
          </h2>
          <p className="mb-3">
            Chúng tôi xử lý thông tin dựa trên lợi ích hợp pháp trong việc vận
            hành và cải thiện website, và để tuân thủ các nghĩa vụ pháp lý.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Thay Đổi Chính Sách Này
          </h2>
          <p className="mb-3">
            Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian.
            Ngày &quot;Cập nhật lần cuối&quot; ở đầu trang này cho biết khi nào
            chính sách được sửa đổi lần cuối.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            10. Thông Tin Liên Hệ
          </h2>
          <p className="mb-3">
            Nếu bạn có câu hỏi hoặc thắc mắc về chính sách bảo mật này, vui lòng
            liên hệ với chúng tôi tại địa chỉ email:{" "}
            <a
              href="mailto:lehoangphuc1820@gmail.com"
              className="text-blue-600 hover:underline"
            >
              lehoangphuc1820@gmail.com
            </a>
          </p>
        </section>

        <section className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Chính sách bảo mật này có hiệu lực từ ngày 1 tháng 10, 2025, và áp
            dụng cho tất cả người dùng của website Tra cứu Pháp luật Bảo vệ Động
            vật Hoang dã.
          </p>
        </section>
      </div>
    </>
  );
}
