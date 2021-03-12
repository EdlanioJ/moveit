export default function getThumbTemplate(
  level: number,
  completedChallenge: number,
  totalExperience: number
) {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thumbnail</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      body {
        background-color: #f2f3f5;
        color: #666666;
        font-family: Inter, sans-serif;
      }

      .container {
        height: 100vh;
        max-width: 992px;
        margin: 0 auto;
        padding: 2.5rem 2rem;

        display: flex;
        flex-direction: column;
      }

      .container section {
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6.25rem;
        align-content: center;
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align: center;

        width: 100%;
        max-width: 480px;
      }

      .content header {
        font-weight: 700;
        background: url('${
          process.env.API_URL
        }/icons/levelup.svg') center no-repeat;
        background-size: contain;
        font-size: 14rem;
        color: #5964e8;
      }

      .content strong {
        font-size: 2.5rem;
        color: #2e384d;
        font-weight: 700;
      }

      .content:last-child {
        text-align: left;
      }

      .content h1 {
        font-weight: 700;
        font-size: 1.25rem;
        margin-bottom: 1rem;
        opacity: 0.75;
        text-transform: uppercase;
      }

      .content p {
        margin-bottom: 2.25rem;
        padding-bottom: 1.75rem;
        font-weight: 500;
        font-size: 1.75rem;

        border-bottom: 2px solid #dcdde0;
      }

      .content p span {
        color: #5964e8;
      }

      .content img {
        height: 3.5rem;
        align-self: flex-start;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <section>
        <div class="content">
          <header>${level}</header>
          <strong>Avancei para o próximo level</strong>
        </div>
        <div class="content">
          <h1>Desafios</h1>
          <p><span>${completedChallenge}</span> Completados</p>

          <h1>Expêriencia</h1>
          <p><span>${Intl.NumberFormat('pt').format(
            totalExperience
          )}</span> xp</p>

          <br />

          <img src="${process.env.API_URL}/logo-full.svg" alt="Logo" />
        </div>
      </section>
    </div>
  </body>
</html>
  `;
}
