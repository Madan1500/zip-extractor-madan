import ZipCompressor from "../components/ZipCompressor";
import ZipExtractor from "../components/ZipExtractor";

const ZipOutlet = () => {
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} className="bg-pine-green">
      <header style={{ padding: '16px', maxWidth: '1200px', width: '100%', border: '1px solid #ccc', borderRadius: '8px' }} className="bg-ash-gray min-h-screen flex flex-col justify-center">
        <h1 style={{ textAlign: 'center', marginBottom: '16px' }} className="text-2xl font-sans font-semibold">Zip File Utility</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="flex-col md:flex-row">
          <ZipCompressor />
          <ZipExtractor />
        </div>
      </header>
    </div>
    </>
  )
}

export default ZipOutlet
