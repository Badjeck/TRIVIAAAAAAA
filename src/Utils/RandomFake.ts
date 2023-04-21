
export class RandomFake{
    
    private diceCount = 1;

    public rollADice6(){
        this.diceCount = this.diceCount === 6 ? this.diceCount = 1 : this.diceCount++;
        return this.diceCount 
    }
}