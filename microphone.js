class Microphone {
    constructor(){
        this.initialized=false;

        // getUserMedia : returns a promise that resolves 
        // in a media stream object wich contains microphone audio data
        navigator.mediaDevices.getUserMedia({audio:true})
        .then (function (stream){
            this.audioContext = new AudioContext();

            // createMediaStreamSource takes raw media stream, in this case raw audio 
            // data comming from microphone and it converts it into audio nodes.
            this.microphone = this.audioContext.createMediaStreamSource(stream);

            // CreateAnalyser creates analyser node, wich can be used to expose 
            // audio time and frequency data to create visualisations.
            this.analyser = this.audioContext.createAnalyser();

            // fftSize = échantillonnage de la FFT, doit être une puissance de 2
            // frequencyBinCount : la moitié de fftSize
            this.analyser.fftSize = 512;
            const bufferLength = this.analyser.frequencyBinCount;

            // Uint8Array can only hold elements that are 8 bit unsigned (0 - 255)
            this.dataArray = new Uint8Array(bufferLength);

            // connect allows us to connect data from one audio node to another
            this.microphone.connect(this.analyser);
            this.initialized=true;
        }.bind(this))
        .catch(function(err){
            alert(err);
        });
    }
    getSamples(){
        // getByteTimeDomainData copies the current waveform or time domain 
        // data into an Uin8Array (unsigned byte) array we pass to it
        this.analyser.getByteTimeDomainData(this.dataArray);

        // Conversion en tableau 'normal' et normalisation (conversion en -1 et 1)
        // on pert de valeurs entre 0 et 255, en divisant par 128 on a des valeurs entre 0 et 2
        let normSamples = [...this.dataArray].map(e => e/128 - 1);
        return normSamples;
    }
    getVolume(){
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSamples = [...this.dataArray].map(e => e/128 - 1);
        let sum = 0;

        // Root Mean Square (RMS) is a measure of the magnitude of a set of numbers
        // It gives a sense for the typical size of the numbers
        for (let i=0 ; i < normSamples.length ; i++){
            sum += normSamples[i]*normSamples[i];
        }
        let volume = Math.sqrt(sum / normSamples.length);
        return volume;
    }
}
// const microphone = new Microphone();
// console.log(microphone);
