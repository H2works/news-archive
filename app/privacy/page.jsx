import { NewsHeader } from "@/components/news-header"
import { NewsFooter } from "@/components/news-footer"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <NewsHeader />

      <div className="space-y-12 px-8 py-8 mx-auto">
        {/* 日本語 */}
        <section className="space-y-4">
          <h1 className="text-2xl font-bold">プライバシーポリシー</h1>

          <p>
            当サイト（news-archive.h2works.xyz）では、第三者配信の広告サービス（Google AdSense）を利用しています。
            これらの広告配信事業者は、ユーザーの興味に応じた広告を表示するために Cookie を使用することがあります。
          </p>

          <p>
            Cookie を使用することで、当サイトや他サイトへの過去のアクセス情報に基づいて広告を配信することが可能になります。
            Google による広告での Cookie の使用を無効にする方法については、Google の広告設定をご確認ください。
          </p>

          <p>
            当サイトでは、サイトの利用状況を把握するためにアクセス解析ツールを使用する場合があります。
            これらの解析ツールはトラフィックデータの収集のために Cookie を使用しますが、
            このデータは匿名で収集されており、個人を特定するものではありません。
          </p>

          <p>
            当サイトに掲載されている情報については、正確な内容を提供するよう努めていますが、
            その正確性・安全性を保証するものではありません。
            当サイトの利用によって生じた損害等について、一切の責任を負いかねますのでご了承ください。
          </p>

          <p>
            本ポリシーの内容は、法令の変更や運営方針の見直しにより、予告なく変更される場合があります。
          </p>

          <p>
            プライバシーポリシーに関するお問い合わせは、
            <a
              href="mailto:info@h2works.xyz"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              info@h2works.xyz
            </a>
            までお願いいたします。
          </p>
        </section>

        {/* English */}
        <section className="space-y-4">
          <h1 className="text-2xl font-bold">Privacy Policy</h1>

          <p>
            This website (news-archive.h2works.xyz) uses third-party advertising services such as Google AdSense.
            These ad providers may use cookies to display advertisements based on users’ interests.
          </p>

          <p>
            Cookies enable ad providers to serve ads based on a user’s previous visits to this or other websites.
            Users may opt out of personalized advertising by visiting Google’s Ads Settings.
          </p>

          <p>
            This site may use access analytics tools to understand website usage.
            These tools collect traffic data using cookies, but the data is collected anonymously and does not identify individuals.
          </p>

          <p>
            While we strive to provide accurate information, we do not guarantee the completeness or accuracy of the content.
            We are not responsible for any damages arising from the use of this website.
          </p>

          <p>
            This privacy policy may be updated without prior notice due to changes in laws or site operations.
          </p>

          <p>
            For inquiries regarding this privacy policy, please contact us at
            <a
              href="mailto:info@h2works.xyz"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              info@h2works.xyz
            </a>
            .
          </p>
        </section>
      </div>

      <NewsFooter />
    </div>
  )
}
