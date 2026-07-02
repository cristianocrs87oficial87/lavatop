type Props = {
  titulo: string;
  valor: string;
  icone: string;
  cor: string;
  descricao?: string;
};

export default function CardIndicador({
  titulo,
  valor,
  icone,
  cor,
  descricao,
}: Props) {
  return (
    <div
      className={`${cor} rounded-2xl p-5 shadow-lg transition hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl">{icone}</span>

        <div className="text-right">
          <p className="text-white/80 text-sm">{titulo}</p>

          <h2 className="text-3xl font-bold text-white mt-1">
            {valor}
          </h2>
        </div>
      </div>

      {descricao && (
        <p className="mt-4 text-sm text-white/80">
          {descricao}
        </p>
      )}
    </div>
  );
}