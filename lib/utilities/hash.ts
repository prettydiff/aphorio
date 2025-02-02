
import log from "./log.js";
import node from "./node.js";

const hash = function utilities_hash(config:config_hash):void {
    const hashOutput:hash_output = {
        filePath: (config.hash_input_type === "file" && typeof config.source === "string")
            ? config.source
            : "",
        hash: "",
        size: 0
    };
    if (config.hash_input_type === "file") {
        const errorMessage = function utilities_hash_errorMessage(err:node_error):void {
            const output:string = `Source is either not a file or resulted in an error.\n\n${JSON.stringify(err)}`;
            hashOutput.hash = output;
            config.callback(hashOutput);
            log({
                action: "add",
                config: null,
                message: output,
                status: "error",
                type: "socket"
            });
        };
        node.fs.stat(config.source, function utilities_hash_statCallback(ers:node_error, stat:node_fs_Stats):void {
            if (ers === null && stat.isFile() === true) {
                hashOutput.size = stat.size;
                if (config.digest === "base64-output") {
                    node.fs.readFile(config.source, function utilities_hash_statCallback_base64(erb:node_error, fileContents:Buffer):void {
                        if (erb === null) {
                            hashOutput.hash = Buffer.from(fileContents).toString("base64");
                            config.callback(hashOutput);
                        } else {
                            errorMessage(erb);
                        }
                    });
                } else {
                    const hashStream:node_fs_ReadStream = node.fs.createReadStream(config.source),
                        hash:node_crypto_Hash = node.crypto.createHash(config.algorithm),
                        hashBack = function utilities_hash_statCallback_hashBack():void {
                            hashOutput.hash = hash.digest(config.digest as "base64").replace(/\s+/g, "");
                            config.callback(hashOutput);
                        };
                    hashStream.pipe(hash);
                    hashStream.on("close", hashBack);
                }
            } else {
                errorMessage(ers);
            }
        });
    } else {
        const buf:Buffer = Buffer.from(config.source);
        hashOutput.size = buf.byteLength;
        if (config.digest === "base64-output") {
            hashOutput.hash = buf.toString("base64");
        } else {
            const hash:node_crypto_Hash = node.crypto.createHash(config.algorithm);
            hash.update(config.source);
            hashOutput.hash = hash.digest(config.digest);
        }
        config.callback(hashOutput);
    }
};

export default hash;