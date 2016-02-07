class LoggedUser {
    var votedPostIds = [Int]()
}

class RawCategory {
    let id:Int
    let name:String

    init(id:Int, name:String) {
        self.id = id
        self.name = name
    }
}

class RawPost {
    let id:Int
    let name:String
    let categoryId:Int

    init( id:Int, name:String, categoryId:Int) {
        self.id = id
        self.name = name
        self.categoryId = categoryId
    }
}

class Post {
    let id:Int
    let name:String
    let category:RawCategory
    let isVoted:Bool

    init(id:Int, name:String, category:RawCategory, isVoted:Bool) {
        self.id = id
        self.name = name
        self.category = category
        self.isVoted = isVoted
    }
}


protocol StoreObserver : class, AnyObject {
    func storeDidChange()
}

struct StoreWeekObserverWrapper {
    private weak var observer:StoreObserver?

    init(_ observer: StoreObserver) {
        self.observer = observer
    }

    func get() -> StoreObserver? {
        return observer
    }
}

protocol Storable {
    var id:Int { get }
}

class Store {
    private var observers = Array<StoreWeekObserverWrapper>()

    func addObserver(observer:StoreObserver) {
        observers.append(StoreWeekObserverWrapper(observer))
    }

    func notify() {
        var cleanArray = false
        for wrapper in observers {
            if let observer = wrapper.get() {
                observer.storeDidChange()
            } else {
                cleanArray = true
            }
        }

        if cleanArray {
            observers = observers.filter({ (wrapper) -> Bool in
                return wrapper.observer != nil
            })
        }
    }
}

class CompositeStore<T, S : Store> : Store, StoreObserver {
    typealias CompositeStoreFetcher = (store:S, id: Int) -> T?

    private var cache = [Int:T]()
    private var fetcher:CompositeStoreFetcher
    private var parentStore:S

    init(parentStore:S, fetcher:CompositeStoreFetcher) {
        self.fetcher = fetcher
        self.parentStore = parentStore

        super.init()

        self.parentStore.addObserver(self)
    }

    func get(id:Int) -> T? {
        return cache[id] ?? fetch(id)
    }

    private func fetch(id: Int) -> T? {
        if let object = fetcher(store: parentStore, id: id) {
            cache[id] = object

            return object
        }

        return nil
    }

    func storeDidChange() {
        cache = [Int:T]()
        notify()
    }
}

class PostStore : CompositeStore<Post, RawStore> {
    init(parentStore:RawStore) {
        super.init(parentStore: parentStore) { (store: RawStore, id: Int) -> Post? in

            guard let post = store.posts[id] else { return nil }
            guard let category = store.categories[post.categoryId] else { return nil }

            return Post(
                id: post.id,
                name: post.name,
                category: category,
                isVoted: store.user.votedPostIds.contains(post.id)
            )
        }
    }
}

enum RawStoreAction {
    case Upvote(Int)
/*
    
    case Load([AnyObject])

    case UpvotePost(Post)
    case DownvotePost(Post)
    case FollowUser(User)
    case UnfollowUser(User)
    case FollowCollection(Collection)
    case UnfollowCollection(Collection)
    case SubscribeToLiveEvent(LiveEvent)
    case UnsubscribeFromLiveEvent(LiveEvent)

    case AddToCollection(Collection, Post)
    
    case RemoveFromCollection(Collection, Post)
    
    case Category([Category])
    
    case Login(LoggedUser)
    case Logout
*/
}

class RawStore : Store {
    var posts = [Int:RawPost]()
    var categories = [Int:RawCategory]()
    var user = LoggedUser()

    func handleAction(action:RawStoreAction) {
        switch(action) {
        case .Upvote(let postId):
            if user.votedPostIds.contains(postId) {
                return
            }

            user.votedPostIds.append(postId)

            if let post = self.posts[postId] {
                //post.votesCount = 10
                self.posts[postId] = post
            }

            break
        }

        notify()
    }
}

let rawStore = RawStore()

rawStore.categories[1] = RawCategory(id: 1, name: "Tech")
rawStore.posts[1] = RawPost(id: 1, name: "Test", categoryId: 1)

let postsStore = PostStore(parentStore: rawStore)

postsStore.get(1)?.category.name

rawStore.categories[1] = RawCategory(id: 1, name: "Updated Tech")
rawStore.notify()

postsStore.get(1)?.category.name

postsStore.get(1)?.isVoted

rawStore.handleAction(.Upvote(1))

postsStore.get(1)?.isVoted






