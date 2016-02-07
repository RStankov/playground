protocol Storable : AnyObject {
    var id:Int { get }
}

class StoreEntities {
    private var data = [String:Storable]()
    private var isChanged = false

    var isUpdated:Bool {
        get {
            return isChanged
        }
    }

    func copy() -> StoreEntities {
        let entries = StoreEntities()
        entries.data = data
        return entries
    }

    func set(object:Storable) {
        let key = "\(object.dynamicType)-\(object.id)"

        if data[key] !== object {
            data["\(object.dynamicType)-\(object.id)"] = object
            isChanged = true
        }
    }

    func set(objects:[AnyObject]) {
        objects.forEach { (object:AnyObject) in
            if let object = object as? Storable {
                self.set(object)
            }
        }
    }

    func get<T:Storable>(object:T) -> T {
        if let objectInStore = data["\(object.dynamicType)-\(object.id)"] as? T {
            return objectInStore
        }

        return object
    }

    func get<T:Storable>(type:T.Type, id:Int) -> T? {
        if let object = data["\(type)-\(id)"] as? T? {
            return object
        }

        return nil
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

class Store<A> {
    private var entries = StoreEntities()

    final func handle(action:A) {
        let newEntries = reduce(entries.copy(), action: action)
        if newEntries.isUpdated {
            entries = newEntries.copy()
            notify()
        }
    }

    func get<T:Storable>(object:T) -> T {
        return entries.get(object)
    }

    func get<T:Storable>(type:T.Type, id:Int) -> T? {
        return entries.get(type, id: id)
    }

    func reduce(entries:StoreEntities, action:A) -> StoreEntities {
        return entries
    }

    private var observers = Array<StoreWeekObserverWrapper>()

    func addObserver(observer:StoreObserver) {
        observers.append(StoreWeekObserverWrapper(observer))
    }

    private func notify() {
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

// Store Entries test

class Post : Storable {
    let id:Int

    init(_ id:Int) {
        self.id = id
    }
}

class Category : Storable {
    let id:Int

    init(_ id:Int) {
        self.id = id
    }
}

var store = StoreEntities()

var post = Post(2)

store.set(Post(1))
store.set(post)
store.set(Category(1))

store.get(Post.self, id: 1)?.id

var otherStore = store.copy()

otherStore.isUpdated

otherStore.set(post)

otherStore.isUpdated

otherStore.set(Post(1))

otherStore.isUpdated

otherStore.set(Post(3))
store.get(Post.self, id: 3)?.id

// Store test

enum AppStoreAction {
    case Set([AnyObject])
}

class AppStore : Store<AppStoreAction> {
    override func reduce(entries: StoreEntities, action: AppStoreAction) -> StoreEntities {
        switch(action) {
            case .Set(let objects):
                entries.set(objects)

            break
        }

        return entries
    }
}

class SomeAppStoreObserver : StoreObserver {
    func storeDidChange() {
        print("I was called")
    }
}

var appStore = AppStore()
var observer = SomeAppStoreObserver()

appStore.addObserver(observer)
appStore.handle(.Set([Post(1)]))

appStore.get(Post.self, id: 1)?.id

var array = [Post(1)]

appStore.handle(.Set(array))


