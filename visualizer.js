function main() {
    console.log('loaded');
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Javascript classes are used to create many similar objects
    class Bar {
        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            
        }
        update(micInput){
            this.height = micInput * 1000;
        }
        draw(context){
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    const microphone = new Microphone();
    // console.log(microphone);
    let bars = [];
    let barWidth = canvas.width/256;
    function createBars(){
        for (let i=0 ; i < 256 ; i++){
            let color = 'hsl(' + i*2 + ', 100%, 50%)';
            bars.push(new Bar(i * barWidth, canvas.height/2, 1, 20, color));
        }
    }
    createBars();

    function animate(){
        // console.log("animate");

        if (microphone.initialized){
            ctx.clearRect(0,0,canvas.width,canvas.height);

            // Generate audio samples from microphone
            const samples = microphone.getSamples();
            // console.log(samples);
    
            // Animate bars based on microphone data
            bars.forEach (function(bar,i){
                bar.update(samples[i]);
                bar.draw(ctx);
            })
        }
        requestAnimationFrame(animate);
    }
    animate();
 
}



