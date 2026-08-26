export default function PoliticaDePrivacidadPage() {
  return (
    <main className="flex-1 pt-32">
      <div className="mx-auto w-full max-w-2xl px-6 pb-20">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-zinc-900">
          Política de privacidad
        </h1>
        <p className="mb-10 text-sm text-zinc-500">
          Última actualización: agosto de 2026
        </p>

        <div className="flex flex-col gap-8 text-sm leading-6 text-zinc-700">
          <section>
            <h2 className="mb-2 text-base font-medium text-zinc-900">
              1. Qué es Galleryz
            </h2>
            <p>
              Galleryz es un proyecto personal y de uso no comercial, creado
              con fines de aprendizaje y como demostración técnica para
              desarrolladores. No es un producto comercial ni está pensado
              para uso profesional o crítico. Las imágenes y videos mostrados
              provienen de la API pública de Pexels y pertenecen a sus
              respectivos autores.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-zinc-900">
              2. Datos que recopilamos
            </h2>
            <p>
              Guardamos información de tu visita (como páginas vistas o
              interacciones básicas) con fines puramente estadísticos, para
              entender el uso de la web y mejorarla. Esta información se trata
              de forma agregada y anónima siempre que sea posible.
            </p>
            <p className="mt-2">
              Tus favoritos (fotos y videos guardados) se almacenan
              únicamente en tu propio navegador (localStorage) y nunca se
              envían a ningún servidor.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-zinc-900">
              3. Uso de los datos
            </h2>
            <p>
              No vendemos, alquilamos ni compartimos tus datos con terceros
              con fines comerciales. La información estadística recopilada se
              usa exclusivamente para el mantenimiento y mejora de este
              proyecto.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-zinc-900">
              4. Ausencia de responsabilidad
            </h2>
            <p>
              Al ser un proyecto personal sin ánimo de lucro, no ofrecemos
              garantías sobre la disponibilidad, continuidad o integridad del
              servicio. No nos hacemos responsables de pérdidas de datos
              (incluyendo, entre otros, tu lista de favoritos guardada
              localmente), interrupciones del servicio o cualquier daño
              derivado del uso de esta web. El uso de Galleryz es bajo tu
              propia responsabilidad.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-zinc-900">
              5. Servicios de terceros
            </h2>
            <p>
              Esta web consume la API de{" "}
              <a
                href="https://www.pexels.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-black"
              >
                Pexels
              </a>{" "}
              para mostrar fotos y videos. El uso de dicho contenido está
              sujeto a los términos y condiciones de Pexels.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-medium text-zinc-900">
              6. Contacto
            </h2>
            <p>
              Si tienes alguna duda sobre esta política, puedes contactar a
              través del perfil de LinkedIn o GitHub enlazados en el botón de
              información de la web.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
