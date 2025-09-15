export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="text-center p-8 rounded-lg">
        {/* Garanta que o caminho para a sua logo está correto */}
        <img
          src="/logo.png"
          alt="Logo do Escritório"
          className="h-[400px] w-[400px] mx-auto mb-6 animate-pulse" // A animação 'pulse' dá uma sensação de carregamento
        />
        <h2 className="text-2xl font-bold text-[#6E0000] merriweather">
          Gerando sua petição...
        </h2>
        <p className="mt-2 text-[#6E0000]">
          Aguarde um momento enquanto nossa IA redige o documento.
        </p>
      </div>
    </div>
  )
}
