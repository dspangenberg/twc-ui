import type React from 'react'
import DocsLayout from '@/layouts/docs-layout'

const Imprint: React.FC<CodeProps> = ({}) => {
  return (
    <DocsLayout>
      <div className="doc mx-auto w-screen max-w-4xl gap-12 py-4 space-y-6">
        <div>
          <h1>Imprint</h1>
          <p className="font-medium">
            This project is made in the European Union. Therefore, I have a responsibility to make my mark.
          </p>
        </div>

        <p>
          twiceware solutions e. K.<br />
          Inhaber Danny Spangenberg<br />
          Belderberg 7<br />
          D-53111 Bonn<br />
          <a href="https://twiceware.de" target="_blank">https://twiceware.de</a>
        </p>

        <p>
          Handelsregister:<br />
          HRA 6091 (Amtsgericht Bonn)
        </p>

        <p>
          Umsatzsteuer-Identifikationsnummer gem. § 27a UStG:<br />
          DE240386270
        </p>

      </div>
    </DocsLayout>
  )
}

export default Imprint
