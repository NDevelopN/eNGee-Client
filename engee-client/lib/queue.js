export default class CQ {
    constructor(size) {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
        this.size = size;
        this.blocking = false;
    }

    enqueue(element) {
        if (this.blocking){
            return false
        }

        this.elements[this.tail] = element;
        this.tail++;
        if (this.tail > this.size) {
            this.tail = 0
        }

        if (this.tail == this.head) {
            this.blocking = true;
        }

        return true;
    }
    
    dequeue() {
        if (this.head === this.tail) {
            return null;
        }
        
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head ++;

        if (this.head > this.size) {
            this.head = 0;
        }

        this.full = false;
       

        return item;
    }

    peek() {
        return this.elements[this.head];
    }

    get length() {
        if (this.tail < this.head) {
            return (this.size - this.head) + this.tail;
        }

        return Math.abs(this.tail - this.head);
    }

    get isEmpty() {
        if (this.blocking) {
            return this.size
        } else {
            return this.length === 0;
        }
    }
}