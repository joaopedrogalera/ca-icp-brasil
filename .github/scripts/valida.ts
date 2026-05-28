/// <reference types="node" />

import fs from 'fs';
console.log('Running validation script...');

function certsUpdated(): boolean {
    // Se não tiver gerados dados novos, assume que não precisa atualizar
    if(!fs.existsSync('tmp/cacerts.pem') || !fs.existsSync('tmp/result.json')) {
        console.log('Output files not found. Assuming no updates needed.');
        return false;
    }

    // Se não tiver o resultado anterior, assume que precisa atualizar
    if(!fs.existsSync('docs/cacerts.pem') || !fs.existsSync('docs/result.json')) {
        console.log('Previous output files not found. Assuming updates needed.');
        return true;
    }
    
    const newFile = fs.readFileSync('tmp/result.json', 'utf-8');
    const oldFile = fs.readFileSync('docs/result.json', 'utf-8');

    const newFileJson = JSON.parse(newFile);
    const oldFileJson = JSON.parse(oldFile);

    const newCerts = (newFileJson.certificates || [])
                        .map((cert: any) => (cert.fingerprint.toUpperCase()
                        ))
                        .filter((cert: any) => !!cert);
    const oldCerts = (oldFileJson.certificates || [])
                        .map((cert: any) => (cert.fingerprint.toUpperCase()))
                        .filter((cert: any) => !!cert);

    // Compara os certificados para determinar se há atualizações
    if (newCerts.length !== oldCerts.length) {
        console.log('Certificate count has changed. Updates needed.');
        return true;
    }

    const addedCerts = newCerts.filter((newCert: any) => !oldCerts.find((oldCert: any) => oldCert == newCert));
    const removedCerts = oldCerts.filter((oldCert: any) => !newCerts.find((newCert: any) => newCert == oldCert));

    console.log(`${addedCerts.length} certificates added, ${removedCerts.length} certificates removed.`);

    if (addedCerts.length > 0 || removedCerts.length > 0) {
        console.log('Certificate changes detected. Updates needed.');
        return true;
    }

    console.log('No certificate changes detected. No updates needed.');
    return false;
}

function main() {
    const updated: boolean = certsUpdated();

    if (updated) {
        console.log('Updating files in docs/ directory...');
        fs.copyFileSync('tmp/cacerts.pem', 'docs/cacerts.pem');
        fs.copyFileSync('tmp/result.json', 'docs/result.json');
    }
    // Exporta a variável para o GitHub Actions
    if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `updated=${updated}\n`);
    }
    else {
        console.warn('GITHUB_OUTPUT environment variable not found. Output will not be set for GitHub Actions.');
    }
}
main();