//
//  PostVoteButton.swift
//  TestPtoject
//
//  Created by Radoslav Stankov on 12/21/15.
//  Copyright © 2015 Radoslav Stankov. All rights reserved.
//

import UIKit

class PostVoteButton: UIButton {
    var post:Post = Post() {
        didSet {
            if post !== oldValue {
                setTitle( post.votes == 1 ? "1 Vote" : "\(post.votes) Votes", forState: .Normal)
                selected = post.isVoted
            }
        }
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonInit()
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        commonInit()
    }

    func commonInit() {
        addTarget(self, action: "handleTapAction", forControlEvents: .TouchUpInside)
    }

    func handleTapAction() {
        appDelegate().dispatcher.run(VoteForPost(post))
    }
}

class PostVoteButtonContainer: PostVoteButton {
    override func commonInit() {
        super.commonInit()

        // For some reason this always return new weak instance to AppDelegate
        // AppDelegate().dispatcher.store.addObserver(self)

        let d = (UIApplication.sharedApplication().delegate as! AppDelegate).dispatcher
        d.store.addObserver(self)
    }
}

extension PostVoteButtonContainer: StoreObserver {
    func storeDidChange() {
        // For some reason this always return new weak instance to AppDelegate
        // post = AppDelegate().dispatcher.store.current(post)

        let d = (UIApplication.sharedApplication().delegate as! AppDelegate).dispatcher
        post = d.store.get(post)
    }
}