//
//  PostCell.swift
//  TestPtoject
//
//  Created by Radoslav Stankov on 12/18/15.
//  Copyright © 2015 Radoslav Stankov. All rights reserved.
//

import UIKit

class PostCell: UITableViewCell {

    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var voteButton: PostVoteButton!

    var post:Post = Post() {
        didSet {
            if post !== oldValue {
                titleLabel.text = post.name
                voteButton.post = post
            }
        }
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        if (selected) {
            appDelegate().dispatcher.run(OpenPost(post))
        }
    }
}
