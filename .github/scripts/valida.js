"use strict";
/// <reference types="node" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
console.log('Running validation script...');
function certsUpdated() {
    // Se não tiver gerados dados novos, assume que não precisa atualizar
    if (!fs_1.default.existsSync('tmp/cacerts.pem') || !fs_1.default.existsSync('tmp/result.json')) {
        console.log('Output files not found. Assuming no updates needed.');
        return false;
    }
    // Se não tiver o resultado anterior, assume que precisa atualizar
    if (!fs_1.default.existsSync('docs/cacerts.pem') || !fs_1.default.existsSync('docs/result.json')) {
        console.log('Previous output files not found. Assuming updates needed.');
        return true;
    }
    const newFile = fs_1.default.readFileSync('tmp/result.json', 'utf-8');
    const oldFile = fs_1.default.readFileSync('docs/result.json', 'utf-8');
    const newFileJson = JSON.parse(newFile);
    const oldFileJson = JSON.parse(oldFile);
    const newCerts = (newFileJson.certificates || [])
        .map((cert) => (cert.fingerprint.toUpperCase()))
        .filter((cert) => !!cert);
    const oldCerts = (oldFileJson.certificates || [])
        .map((cert) => (cert.fingerprint.toUpperCase()))
        .filter((cert) => !!cert);
    // Compara os certificados para determinar se há atualizações
    if (newCerts.length !== oldCerts.length) {
        console.log('Certificate count has changed. Updates needed.');
        return true;
    }
    const addedCerts = newCerts.filter((newCert) => !oldCerts.find((oldCert) => oldCert == newCert));
    const removedCerts = oldCerts.filter((oldCert) => !newCerts.find((newCert) => newCert == oldCert));
    console.log(`${addedCerts.length} certificates added, ${removedCerts.length} certificates removed.`);
    if (addedCerts.length > 0 || removedCerts.length > 0) {
        console.log('Certificate changes detected. Updates needed.');
        return true;
    }
    console.log('No certificate changes detected. No updates needed.');
    return false;
}
function main() {
    const updated = certsUpdated();
    if (updated) {
        console.log('Updating files in docs/ directory...');
        fs_1.default.copyFileSync('tmp/cacerts.pem', 'docs/cacerts.pem');
        fs_1.default.copyFileSync('tmp/result.json', 'docs/result.json');
    }
    // Exporta a variável para o GitHub Actions
    if (process.env.GITHUB_OUTPUT) {
        fs_1.default.appendFileSync(process.env.GITHUB_OUTPUT, `updated=${updated}\n`);
    }
    else {
        console.warn('GITHUB_OUTPUT environment variable not found. Output will not be set for GitHub Actions.');
    }
}
main();
