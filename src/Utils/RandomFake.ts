import { IMath } from "./IMath";

export class RandomFake implements IMath{
    
    random(): number {
        return 1;
    }
    
    private diceCount = 1;

    public rollADice6(){
        this.diceCount = this.diceCount === 6 ? this.diceCount = 1 : this.diceCount++;
        return this.diceCount 
    }
}