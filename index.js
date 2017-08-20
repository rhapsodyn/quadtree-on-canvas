class QuadTree {
    constructor(capcity, range) {
        this.capcity = capcity;
        this.range = range;

        this.points = [];
        // only four
        this.children = [];
        // only leaf can hold some points
        this.isLeaf = true;
    }

    subdivide() {
        this.children = this.range.breakInto4().map(aabb => {
            let tree = new QuadTree(this.capcity, aabb);

            // split the points
            for (let i = 0; i < this.points.length; i++) {
                if (aabb.contains(this.points[i])) {
                    tree.insert(this.points[i]);
                    break;
                }
            }

            return tree;
        });

        this.points = [];
        this.isLeaf = false;
    }

    // TODO: optimize: find nearest then insert
    insert(point) {
        if (!this.range.contains(point)) return false;

        if (this.isLeaf && this.points.length < this.capcity) {
            this.points.push(point);
            return true;
        }

        if (this.children.length === 0)
            this.subdivide();

        for (let child of this.children) {
            if (child.insert(point)) break;
        }

        return false;
    }
}

class AABB {
    constructor(topLeft, bottomRight) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    contains(point) {
        return this.topLeft.x <= point.x && this.bottomRight.x >= point.x &&
            this.topLeft.y <= point.y && this.bottomRight.y >= point.y;
    }

    breakInto4() {
        let leftX = this.topLeft.x;
        let rightX = this.bottomRight.x;
        let midX = (leftX + rightX) / 2;
        let topY = this.topLeft.y;
        let bottomY = this.bottomRight.y;
        let midY = (topY + bottomY) / 2;

        return [new AABB({x: leftX, y:topY}, {x:midX, y:midY}),
            new AABB({x: midX, y: topY}, {x: rightX, y: midY}),
            new AABB({x: leftX, y: midY}, {x: midX, y: bottomY}),
            new AABB({x: midX, y: midY}, {x: rightX, y: bottomY})
        ];
    }
}

function makeTree(capcity, range) {
    return new QuadTree(capcity, range);
}