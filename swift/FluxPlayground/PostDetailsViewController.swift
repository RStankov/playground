//
//  PostDetailsViewController.swift
//  TestPtoject
//
//  Created by Radoslav Stankov on 12/18/15.
//  Copyright © 2015 Radoslav Stankov. All rights reserved.
//

import UIKit

class PostDetailsViewController: UIViewController {
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var voteButton: PostVoteButtonContainer!

    var post = Post()

    override func viewDidLoad() {
        title = post.name

        nameLabel.text = post.headline

        voteButton.post = post
    }
}
