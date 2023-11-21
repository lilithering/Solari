/*****************************
Solari
Advanced HTML Page Rendering
Author: Lilithering (lilithering@gmail.com)
Update: 23-11-20
[Output] AX::Solari
******************************/

const { cerr, cinfo, clog } = require("./../ArchLib/LogManagement");
const { ReadFile, PathExists } = require("./../ArchLib/FileSystem");
const express = require("./../ArchLib/Common/express");
const { parse } = require("./../ArchLib/Common/html");

const x = {
    style: {
        bootstrap: "<link rel='stylesheet' href='/cdn/tp/bootstrap.css'>",
        system: "<link rel='stylesheet' href='/cdn/tp/StyleSystem.css'>",
    },
    script: {
        bootstrap: "<script src='/cdn/tp/bootstrap.js'></script>",
        vue: "<script src='/cdn/tp/vue.js'></script>",
        dev: `<script src='/cdn/LogSystem.js'></script>`,
    },
    debug: "<div><h1>another</h1></div>",
    container: "<div class='container'></div>",
    title: "<h1></h1>",
    button: "<button class='btn'></button>",
    meta: {
        encoding: "<meta charset='utf-8'>",
        bootstrap: "<meta name='viewport' content='width=device-width, initial-scale=1.0'>",
    },
    row: "<div class='row'></div>",
    col: "<div class='col'></div>",

};

class AXSolari {
    constructor(strRootPath) {
        cinfo("Iniciando Gateway");
        if (!strRootPath) return cerr("Diretório base não informado");
        this.strRootPath = strRootPath;
        if (!this.Create()) return cerr("Falha ao tentar criar a rota");
        if (!this.Defaults()) return cerr("Falha ao tentar definir os padrões da rota");
        if (!this.Favicon()) return cerr("Falha ao definir favicon");
        if (!this.Trigger()) return cerr("Falha ao definir configurações de rota");

        cinfo("Gateway iniciado com sucesso", { name: this.constructor.name });
    }
    cbRouteFavicon = (req, res) => {
        res.send("");
    };
    cbRouteRender = (req, res) => {
        cinfo("Request", { hostname: req.hostname, originalUrl: req.originalUrl });
        if (req.params[0] == '') req.params[0] = 'index';
        let contentPath = `${this.strRootPath}/content/${req.params[0]}.html`;
        if (!PathExists(contentPath)) {
            res.status(404);
            return res.send(clog("404 - File not found", { contentPath }));
        }
        let rawFile = ReadFile(contentPath);
        let documentRoot = parse(rawFile);
        let element;
        while ((element = documentRoot.querySelector("x")) != null) {
            let attr = element.rawAttrs.trim();
            let content = x;
            try {
                attr.split(".").forEach(c => content = content[c]);
                content.errorTest;
            } catch {
                clog("Invalid property", { attr, contentPath });
                element.remove();
                continue;
            }
            let newElement = parse(content).firstChild;
            newElement.appendChild(parse(element.innerHTML));
            element.replaceWith(newElement);
        }
        while ((element = documentRoot.querySelector("xs")) != null) {
            let attr = element.rawAttrs.trim();
            let content = xs;
            try {
                attr.split(".").forEach(c => content = content[c]);
                content.errorTest;
            } catch {
                clog("Invalid property", { attr, contentPath });
                element.remove();
                continue;
            }
            let newElement = parse(content).firstChild;
            newElement.appendChild(parse(element.innerHTML));
            element.replaceWith(newElement);
        }
        res.send(documentRoot.toString());
    };
    Favicon() {
        this.router.get("/favicon.ico", this.cbRouteFavicon);

        return cinfo("Favicon definido");
    };
    Create() {
        this.router = express.Router();

        return cinfo("Rota criada com sucesso");
    };
    Trigger() {
        this.router.get(/\/(.*)/, this.cbRouteRender);

        return cinfo("Gatilhos acionados");;
    };
    Defaults() {
        this.router.use("/cdn", express.static("./../CDN"));
        this.router.use("/scripts", express.static("C:\\Users\\JuniorSilveira\\Repositórios\\MAXXLATINA\\Administrativo\\scripts"));

        return cinfo("Padrões definidos com sucesso");
    };
    Static(strURL, strPath) {
        if (!PathExists(strPath)) return cerr("O caminho especificado não existe.", { strPath });
        this.router.use(strURL, express.static(strPath));

        return cinfo("Rota definida com sucesso", { strURL, strPath });
    };
    Parse() {
        clog("Executando parsing", {});

        return cinfo("Sucesso");
    };
};

module.exports = { AXSolari };