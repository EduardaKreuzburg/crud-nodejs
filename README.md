<h1 align="center">Trabalho 3 - Crud em NodeJS</h1>

<p align="center">🚀 Foi utilizado o template EJS para a parte backend e Bootstrap para o frontend.</p>

<h4 align="center"> 
	 Status: Concluído 
</h4>

<h1>1° Passo</h1>

<p>Criar na raiz do projeto um arquivo com o nome ".env" e dentro dele ter as 
seguintes variáveis de ambiente.</p>


<p style="color:#F87060;">DB_USER='root'</p>
<p style="color:#F87060;">DB_PASSWORD=''</p>
<p style="color:#F87060">DB_DATABASE='crud_nodejs'</p>
<p style="color:#F87060;">DB_HOST='localhost'</p>
<p style="color:#F87060">DB_PORT=3306</p>
<p style="color:#F87060;">APP_PORT=3000</p>
<p style="color:#F87060">SESSION_SECRET='0K3RZ2147'</p>


<p>Substituindo pelos valores adequados conforme o ambiente em que a aplicação irá rodar</p>

<h1>2° Passo</h1>

<p>Criar um banco de dados mysql e informar os dados de conexão no arquivo .env
conforme exemplificado no passo anterior.</p>

<h1>3° Passo</h1>
<p>Rodar o <b style="color:#F87060;">npm install</b> dentro do projeto para que as dependências da aplicação sejam instaladas.</p>

<h1>4° Passo</h1>
<p>Rodar as migrations da aplicação para a criação das tabelas no banco.</p>
<p>Para isso, execute o seguinte comando no terminal dentro da pasta da aplicação:
<b style="color:#F87060;">npx sequelize db:migrate</b></p>

<h1>5° Passo</h1>

<p>Rodar o <b style="color:#F87060;">npm start</b> ou <b style="color:#F87060;">npm run dev</b> para que a aplicação execute.</p>
