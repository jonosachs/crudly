from api.model import NewPost
import api.service as service

def seed_dict():
  starter_posts = [
    NewPost(text="A cloud weighs around a million tonnes"), 
    NewPost(text="Giraffes are 30 times more likely to get hit by lightning than people."), 
    NewPost(text="The Universe's average colour is called 'Cosmic latte'.")
  ]
  
  for post in starter_posts:
    service.create(post)
    
  print(f'seeded entries to database.')
    
    
if __name__ == "__main__":
  seed_dict()