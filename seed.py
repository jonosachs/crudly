import uuid
from api import Post, table, datetime

time = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")

def seed_dict():
  starter_posts = [
    Post(id=str(uuid.uuid4()), timestamp=time, text="A cloud weighs around a million tonnes"), 
    Post(id=str(uuid.uuid4()), timestamp=time, text="Giraffes are 30 times more likely to get hit by lightning than people."), 
    Post(id=str(uuid.uuid4()), timestamp=time, text="The Universe's average colour is called 'Cosmic latte'.")
  ]
  
  for post in starter_posts:
    table.put_item(Item=post.model_dump())
    
  print(f'seeded entries to database.')
    
    
if __name__ == "__main__":
  seed_dict()