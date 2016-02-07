//
//  MasterViewController.swift
//  TestPtoject
//
//  Created by Radoslav Stankov on 12/18/15.
//  Copyright © 2015 Radoslav Stankov. All rights reserved.
//

import UIKit

class MasterViewController: UITableViewController {
    var objects = [Int]()

    override func viewDidLoad() {
        super.viewDidLoad()

        appDelegate().dispatcher.store.addObserver(self)

        Api().getPosts { (posts) in
            self.objects = posts.map { $0.id }
            appDelegate().dispatcher.store.handle(.Set(posts))
        }

        self.title = "Today posts"

        self.tableView.registerNib(UINib(nibName: "PostCell", bundle: nil), forCellReuseIdentifier: "PostCell")
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return objects.count
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("PostCell", forIndexPath: indexPath) as! PostCell

        if let post = appDelegate().dispatcher.store.get(Post.self, id:objects[indexPath.row]) {
            cell.post = post
        }

        return cell
    }

    override func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        self.tableView.deselectRowAtIndexPath(indexPath, animated: false)
    }
}

extension MasterViewController : StoreObserver {
    func storeDidChange() {
        self.tableView.reloadData()
    }
}