interface NodeInterface {
  element: any | null;
  prev: NodeInterface | null;
  next: NodeInterface | null;
}

interface PositionInterface {
  container: any;
  node: NodeInterface;
}

class _DoublyLinkedBase {
  //Base class for a doubly linked list
  protected header;
  protected trailer;
  protected size;
  private Node = class Node {
    //Class for storing a node.
    element: any;
    prev: Node | null;
    next: Node | null;

    constructor(element: any | null, prev: Node | null, next: Node | null) {
      this.element = element;
      this.prev = prev;
      this.next = next;
    }
  };

  constructor() {
    this.header = new this.Node(null, null, null);
    this.trailer = new this.Node(null, null, null);
    this.header.next = this.trailer;
    this.trailer.prev = this.header;
    this.size = 0;
  }

  protected insertBetween = (
    e: any,
    pred: NodeInterface,
    succ: NodeInterface,
  ): NodeInterface => {
    //Add element e between two existing nodes pred and succ
    //Return new node
    const newest = new this.Node(e, pred, succ);
    pred.next = newest;
    succ.prev = newest;
    this.size++;
    return newest;
  };

  protected deleteNode = (node: NodeInterface): any => {
    //Delete nonsentinel node from the list and return its element
    const pred = node.prev;
    const succ = node.next;
    if (!pred || !succ) return;
    pred.next = succ;
    succ.prev = pred;
    this.size--;
    const element = node.element;
    node.prev = node.next = node.element = null;
    return element;
  };

  public length = () => {
    return this.size;
  };

  public is_empty = () => {
    return this.size === 0;
  };
}

class PositionalList extends _DoublyLinkedBase {
  //A sequential container of elements allowing positional access.

  private Position = class Position {
    //Abstraction represent the location of an element.
    container: PositionalList;
    node: NodeInterface;

    constructor(container: PositionalList, node: NodeInterface) {
      this.container = container;
      this.node = node;
    }

    public element = (): any => {
      return this.node.element;
    };

    public equal = (other: Position): boolean => {
      //Return True if other is a Position representing the same location
      return typeof other === typeof this && other.node === this.node;
    };

    public notEqual = (other: Position): boolean => {
      //Return True if other does not represent the same location
      return !this.equal(other);
    };
  };

  //-------------------------Utilities------------------------
  private validate = (p: any): NodeInterface => {
    //Return position's node, or throw error if invalid
    if (!(p instanceof this.Position))
      throw TypeError(`${p} must be proper Position type`);
    if (p.container !== this)
      throw new Error(`${p} does not belong to this container`);
    if (p.node.next === null) throw new Error(`${p} is no longer valid`);

    return p.node;
  };

  private makePosition = (node: NodeInterface): PositionInterface | null => {
    if (node === this.header || node === this.trailer) return null;
    else return new this.Position(this, node);
  };

  //-------------------------Accessors------------------------
  public first = (): PositionInterface | null => {
    return this.makePosition(this.header.next as NodeInterface);
  };

  public last = (): PositionInterface | null => {
    return this.makePosition(this.trailer.prev as NodeInterface);
  };

  public before = (p: PositionInterface): PositionInterface | null => {
    const node = this.validate(p);
    return this.makePosition(node.prev as NodeInterface);
  };

  public after = (p: PositionInterface): PositionInterface | null => {
    const node = this.validate(p);
    return this.makePosition(node.next as NodeInterface);
  };

  public *makeIterator() {
    let cursor = this.first();
    while (cursor) {
      yield cursor.node.element;
      cursor = this.after(cursor);
    }
  }

  //-------------------------Mutators------------------------
  private insertBetweenPosition = (
    e: any,
    pred: NodeInterface,
    succ: NodeInterface,
  ): PositionInterface | null => {
    const node = super.insertBetween(e, pred, succ);
    return this.makePosition(node);
  };

  public addFirst = (e: any): PositionInterface | null => {
    return this.insertBetweenPosition(
      e,
      this.header,
      this.header.next as NodeInterface,
    );
  };

  public addLast = (e: any): PositionInterface | null => {
    return this.insertBetweenPosition(
      e,
      this.trailer.prev as NodeInterface,
      this.trailer,
    );
  };

  public addBefore = (
    p: PositionInterface,
    e: any,
  ): PositionInterface | null => {
    const original = this.validate(p);
    return this.insertBetweenPosition(
      e,
      original.prev as NodeInterface,
      original,
    );
  };

  public addAfter = (
    p: PositionInterface,
    e: any,
  ): PositionInterface | null => {
    const original = this.validate(p);
    return this.insertBetweenPosition(
      e,
      original,
      original.next as NodeInterface,
    );
  };

  public delete = (p: PositionInterface): any => {
    const orginal = this.validate(p);
    return this.deleteNode(orginal);
  };

  public replace = (p: PositionInterface, e: any): any => {
    const original = this.validate(p);
    const oldValue = original.element;
    original.element = e;
    return oldValue;
  };
}

export default PositionalList;
